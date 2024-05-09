import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PerformanceDocument } from '../schemas/performance.schema';
import { CatchError } from '../utils/catchError';
import { GetListDto, GetPerfDetailDto, OverviewDto } from 'src/dto/performance';
import * as UAParser from 'ua-parser-js';
import { SchemaName } from '../utils/constant';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(SchemaName.performance)
    private performanceModel: Model<PerformanceDocument>,
  ) {}
  /**
   * 性能数据总览
   *
   * @param {ApplicationInfo} ApplicationInfo
   * @return {*}
   * @memberof PerformanceService
   */
  @CatchError()
  async getOverview(appInfo: ApplicationInfo & OverviewDto) {
    const { appId, startAt, endAt } = appInfo;

    const query: FilterQuery<PerformanceDocument> = {
      appId,
    };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    const data = await this.performanceModel.aggregate([
      {
        $match: {
          ...query,
          $and: [
            { lcp: { $ne: 0 } },
            { lcp: { $ne: null } },
            { fcp: { $ne: null } },
            { fcp: { $ne: 0 } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          lcp_mean: { $avg: '$lcp' },
          lcp_stddev: { $stdDevSamp: '$lcp' },
          fcp_mean: { $avg: '$fcp' },
          fcp_stddev: { $stdDevSamp: '$fcp' },
        },
      },
    ]);

    const fidRes = await this.performanceModel.aggregate([
      {
        $match: {
          ...query,
          $and: [{ fid: { $ne: null } }, { fid: { $ne: 0 } }],
        },
      },
      {
        $group: {
          _id: null,
          fid_mean: { $avg: '$fid' },
        },
      },
    ]);

    const clsRes = await this.performanceModel.aggregate([
      {
        $match: {
          ...query,
          $and: [{ cls: { $ne: null } }, { cls: { $ne: 0 } }],
        },
      },
      {
        $group: {
          _id: null,
          cls_mean: { $avg: '$cls' },
        },
      },
    ]);

    const ttfbRes = await this.performanceModel.aggregate([
      {
        $match: {
          ...query,
          $and: [{ ttfb: { $ne: null } }, { ttfb: { $ne: 0 } }],
        },
      },
      {
        $group: {
          _id: null,
          ttfb_mean: { $avg: '$ttfb' },
        },
      },
    ]);

    const fid_mean = fidRes?.[0]?.fid_mean;
    const cls_mean = clsRes?.[0]?.cls_mean;
    const ttfb_mean = ttfbRes?.[0]?.ttfb_mean;

    if (!data.length) {
      return {
        code: 0,
        message: '',
      };
    }

    const lcp_mean = data[0].lcp_mean;
    const lcp_stddev = data[0].lcp_stddev || 0;
    const lcp_upper = lcp_mean + 3 * lcp_stddev + 1;
    let lcp_lower = lcp_mean - 3 * lcp_stddev - 1;
    lcp_lower = lcp_lower > 0 ? lcp_lower : 0;

    const fcp_mean = data[0].fcp_mean;
    const fcp_stddev = data[0].fcp_stddev || 0;
    const fcp_upper = fcp_mean + 3 * fcp_stddev + 1;
    let fcp_lower = fcp_mean - 3 * fcp_stddev - 1;
    fcp_lower = fcp_lower > 0 ? fcp_lower : 0;

    const todaysRes = await this.performanceModel.aggregate([
      {
        $match: {
          lcp: {
            $gt: lcp_lower,
            $lt: lcp_upper,
          },
          fcp: {
            $gt: fcp_lower,
            $lt: fcp_upper,
          },
          ...query,
        },
      },
      {
        $addFields: {
          TTI: { $subtract: ['$domInteractive', '$fetchStart'] },
        },
      },
      {
        $group: {
          _id: null,
          TTI: { $avg: '$TTI' },
          LCP: { $avg: '$lcp' },
          FCP: { $avg: '$fcp' },
          unloadEventStart: { $avg: '$unloadEventStart' },
          unloadEventEnd: { $avg: '$unloadEventEnd' },
          redirectStart: { $avg: '$redirectStart' },
          redirectEnd: { $avg: '$redirectEnd' },
          domainLookupStart: { $avg: '$domainLookupStart' },
          domainLookupEnd: { $avg: '$domainLookupEnd' },
          connectStart: { $avg: '$connectStart' },
          secureConnectionStart: {
            $avg: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ['$secureConnectionStart', null] },
                    { $eq: ['$secureConnectionStart', 0] },
                  ],
                },
                then: '$connectEnd',
                else: '$secureConnectionStart',
              },
            },
          },
          connectEnd: { $avg: '$connectEnd' },
          requestStart: { $avg: '$requestStart' },
          responseStart: { $avg: '$responseStart' },
          responseEnd: { $avg: '$responseEnd' },
          domInteractive: { $avg: '$domInteractive' },
          domContentLoadedEventStart: { $avg: '$domContentLoadedEventStart' },
          domContentLoadedEventEnd: { $avg: '$domContentLoadedEventEnd' },
          domComplete: { $avg: '$domComplete' },
          loadEventStart: { $avg: '$loadEventStart' },
          loadEventEnd: { $avg: '$loadEventEnd' },
          fetchStart: { $avg: '$fetchStart' },
        },
      },
    ]);

    if (!todaysRes.length) {
      return {
        code: 0,
        data: {},
      };
    }

    const todays = todaysRes[0];
    Object.keys(todays).forEach((k) => {
      if (todays[k] && !Number.isNaN(Number(todays[k])))
        todays[k] = Number(todays[k].toFixed(2));
      if (!todays[k]) todays[k] = 0;
    });
    return {
      code: 0,
      data: {
        ...todays,
        FID: Number(fid_mean?.toFixed(2)),
        CLS: Number(cls_mean?.toFixed(2)),
        TTFB: Number(ttfb_mean?.toFixed(2)),
      },
    };
  }

  @CatchError()
  async getList(params: ApplicationInfo & GetListDto) {
    const {
      appId,
      page = 1,
      pageSize = 15,
      sortColumn,
      sortStatus,
      name,
    } = params;

    const query: FilterQuery<PerformanceDocument> = {
      appId,
    };

    if (name) {
      query.content_name = {
        $regex: new RegExp(name, 'i'),
      };
    }

    let sortCondition: Record<string, any> = {
      createdAt: -1,
    };
    if (sortColumn && sortStatus) {
      sortCondition = { [sortColumn]: sortStatus === 'asc' ? 1 : -1 };
      query.$and = [
        { [sortColumn]: { $exists: true } },
        { [sortColumn]: { $ne: '' } },
      ];
    }

    const res = await this.performanceModel.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          data: [
            {
              $sort: sortCondition,
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $project: {
                fcp: 1,
                lcp: 1,
                ttfb: 1,
                cls: 1,
                fid: 1,
                createdAt: 1,
                href: 1,
                networkType: 1,
              },
            },
          ],
          count: [{ $count: 'total' }],
        },
      },
      { $unwind: '$count' },
      { $addFields: { total: '$count.total' } },
    ]);

    const { data = [], total } = res?.[0] || {};

    return {
      code: 0,
      data: {
        total,
        list: data,
      },
    };
  }

  @CatchError()
  async getDetail(params: ApplicationInfo & GetPerfDetailDto) {
    const { appId, id } = params;
    const res = await this.performanceModel.findOne({
      _id: id,
      appId,
    });

    if (!res) {
      return {
        code: 1,
        message: '未查询到记录',
      };
    }

    const { ua, _id, createdAt } = res;

    const uap = new UAParser(ua);

    const os = uap.getOS();
    const engine = uap.getEngine();
    const browser = uap.getBrowser();
    const device = uap.getDevice();

    return {
      code: 0,
      data: {
        _id,
        createdAt,
        ua,
        os,
        engine,
        browser,
        device,
      },
    };
  }
}
