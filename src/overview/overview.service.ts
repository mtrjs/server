import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PerformanceDocument } from '../schemas/performance.schema';
import { UAParser } from 'ua-parser-js';
import IP2Region from 'ip2region';
import { DateFilterDto } from 'src/dto/common';
import { CatchError } from 'src/utils/catchError';
import { DeviceDto, GetChannelStatDto } from 'src/dto/overview';

export enum Dimension {
  os = 'os',
  browser = 'browser',
  engine = 'engine',
}

@Injectable()
export class OverviewService {
  constructor(
    @InjectModel('performance')
    private performanceModel: Model<PerformanceDocument>,
  ) {}

  @CatchError()
  async getUserStat(appInfo: ApplicationInfo & DateFilterDto) {
    const { appId, startAt, endAt } = appInfo;

    const query: FilterQuery<PerformanceDocument> = { appId };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    const pv = (await this.performanceModel.count(query)) || 0;

    const uvRes = await this.performanceModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$ip',
        },
      },
      {
        $count: 'uv',
      },
    ]);

    let uv = 0;
    if (uvRes.length) {
      uv = uvRes[0].uv;
    }

    let result = await this.performanceModel.aggregate([
      {
        $match: {
          $and: [{ ip: { $ne: null } }, { ip: { $ne: '' } }],
          ...query,
        },
      },
      { $group: { _id: '$ip', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);

    const regionQuery = new IP2Region();

    result = result.map((o) => {
      const ua = new UAParser(o.ua);
      const { os, browser, engine } = ua.getResult() || {};
      let { province } = regionQuery.searchRaw(o.ip);
      province = province || '未知';
      province = /省|未知/.test(province) ? province : province + '市';
      return {
        ...o,
        os: os.name || '未知',
        browser: browser.name || '未知',
        engine: engine.name || '未知',
        province: province,
      };
    });

    let [province] = result.reduce(
      (acc, cur) => {
        const { province } = cur;
        const provinceObj = acc[0];
        provinceObj[province] = (provinceObj[province] || 0) + 1;
        return acc;
      },
      [{}],
    );

    province = Object.entries(province).reduce((acc, [name, value]) => {
      acc.push({ name, value });
      return acc;
    }, []);

    return {
      code: 0,
      data: {
        visit: { pv, uv },
        province,
      },
    };
  }

  @CatchError()
  async getDeviceInfo(data: ApplicationInfo & DeviceDto) {
    const { appId, startAt, endAt, type } = data;

    const query: FilterQuery<PerformanceDocument> = { appId };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    const uas = await this.performanceModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$ip',
          ua: {
            $first: '$ua',
          },
        },
      },
    ]);

    if (!uas) {
      return {
        code: 0,
        data: {},
      };
    }

    const deviceMap = (uas as PerformanceDocument[]).reduce<
      Map<string, number>
    >((acc, o) => {
      const ua = new UAParser(o.ua as string);
      const { os, browser, engine } = ua.getResult() || {};
      let name = os?.name || '未知';
      if (type === Dimension.browser) {
        name = browser?.name || '未知';
      } else if (type === Dimension.engine) {
        name = engine?.name || '未知';
      }
      const prevCount = acc.get(name) || 0;
      acc.set(name, prevCount + 1);
      return acc;
    }, new Map());

    const device: { label: string; value: number }[] = [];
    for (const [key, value] of deviceMap.entries()) {
      device.push({ label: key, value });
    }
    return {
      code: 0,
      data: device,
    };
  }

  @CatchError()
  async getChannelStat(body: ApplicationInfo & GetChannelStatDto) {
    const { appId, startAt, endAt } = body;

    const query: FilterQuery<PerformanceDocument> = {
      appId,
    };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    const res = await this.performanceModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$ip',
          referrer: {
            $first: '$referrer',
          },
        },
      },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 },
        },
      },
    ]);

    const arr = res || [];
    let ne = 0;

    const data = arr.reduce((acc, cur) => {
      const { _id, count } = cur || {};

      if (!_id) {
        ne += count;
      } else {
        acc.push({ label: _id, value: count });
      }
      return acc;
    }, []);

    data.push({ label: '未知', value: ne });
    return {
      code: 0,
      data,
    };
  }
}
