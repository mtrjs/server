import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PerformanceDocument } from '../schemas/performance.schema';
import { CatchError } from 'src/utils/catchError';
import { OverviewDto } from 'src/dto/performance';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel('performance')
    private performanceModel: Model<PerformanceDocument>,
  ) {}
  /**
   * 性能数据总览
   *
   * @param {AppInfo} appInfo
   * @return {*}
   * @memberof PerformanceService
   */
  @CatchError()
  async getOverview(appInfo: AppInfo & OverviewDto) {
    const { app_env, app_id, startAt, endAt } = appInfo;

    const query: FilterQuery<PerformanceDocument> = { app_env, app_id };

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
    const lcp_stddev = data[0].lcp_stddev;
    const lcp_upper = lcp_mean + 3 * lcp_stddev;
    let lcp_lower = lcp_mean - 3 * lcp_stddev;
    lcp_lower = lcp_lower > 0 ? lcp_lower : 0;

    const fcp_mean = data[0].fcp_mean;
    const fcp_stddev = data[0].fcp_stddev;
    const fcp_upper = fcp_mean + 3 * fcp_stddev;
    let fcp_lower = fcp_mean - 3 * fcp_stddev;
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
}
