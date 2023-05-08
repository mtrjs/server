import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  GetConsoleListDto,
  GetExceptionListDto,
  GetJsExceptionDto,
  TrendDto,
} from 'src/dto/exception.dto';
import { RequestExceptionDocument } from 'src/schemas/request_exception.schema';
import { ResourceExceptionDocument } from 'src/schemas/resource_exception.schema';
import { CatchError } from 'src/utils/catchError';
import { JsExceptionDocument } from '../schemas/js_exception.schema';
import * as UAParser from 'ua-parser-js';
import SourcemapParser from 'src/utils/sourcemap';
import { ConsoleDocument } from 'src/schemas/console_exception.schema';

@Injectable()
export class ExceptionService {
  constructor(
    @InjectModel('js_exception')
    private JsExceptionModel: Model<JsExceptionDocument>,
    @InjectModel('request_exception')
    private RequestExceptionModel: Model<RequestExceptionDocument>,
    @InjectModel('resource_exception')
    private ResourceExceptionModel: Model<ResourceExceptionDocument>,
    @InjectModel('console_exception')
    private ConsoleModel: Model<ConsoleDocument>,
  ) {}

  @CatchError()
  async getJsTrend(params: ApplicationInfo & TrendDto) {
    const { app_env, app_id, startAt, endAt } = params;

    const query: FilterQuery<JsExceptionDocument> = {
      app_env,
      app_id,
    };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt['$gt'] = startAt;
      if (endAt) query.createdAt['$lt'] = endAt;
    }

    const result = await this.JsExceptionModel.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          date: { $toDate: '$createdAt' },
        },
      },
      {
        $group: {
          _id: {
            hour: {
              $dateToString: {
                format: '%Y-%m-%d %H:00:00',
                date: '$date',
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.hour': 1,
        },
      },
      {
        $project: {
          date: '$_id.hour',
          value: '$count',
          _id: 0,
        },
      },
    ]);
    return {
      code: 0,
      data: result,
    };
  }

  @CatchError()
  async getResourceTrend(params: ApplicationInfo & TrendDto) {
    const { app_env, app_id, startAt, endAt } = params;

    const query: FilterQuery<ResourceExceptionDocument> = {
      app_env,
      app_id,
    };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt['$gt'] = startAt;
      if (endAt) query.createdAt['$lt'] = endAt;
    }

    const result = await this.ResourceExceptionModel.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          date: { $toDate: '$createdAt' },
        },
      },
      {
        $group: {
          _id: {
            hour: {
              $dateToString: {
                format: '%Y-%m-%d %H:00:00',
                date: '$date',
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.hour': 1,
        },
      },
      {
        $project: {
          date: '$_id.hour',
          value: '$count',
          _id: 0,
        },
      },
    ]);
    return {
      code: 0,
      data: result,
    };
  }

  @CatchError()
  async getRequestTrend(params: ApplicationInfo & TrendDto) {
    const { app_env, app_id, startAt, endAt } = params;

    const query: FilterQuery<RequestExceptionDocument> = {
      app_env,
      app_id,
    };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt['$gt'] = startAt;
      if (endAt) query.createdAt['$lt'] = endAt;
    }
    const result = await this.RequestExceptionModel.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          date: { $toDate: '$createdAt' },
        },
      },
      {
        $group: {
          _id: {
            hour: {
              $dateToString: {
                format: '%Y-%m-%d %H:00:00',
                date: '$date',
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.hour': 1,
        },
      },
      {
        $project: {
          date: '$_id.hour',
          value: '$count',
          _id: 0,
        },
      },
    ]);
    return {
      code: 0,
      data: result,
    };
  }

  @CatchError()
  async getConsoleTrend(params: ApplicationInfo & TrendDto) {
    const { app_env, app_id, startAt, endAt } = params;

    const query: FilterQuery<ConsoleDocument> = {
      app_env,
      app_id,
    };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt['$gt'] = startAt;
      if (endAt) query.createdAt['$lt'] = endAt;
    }
    const result = await this.ConsoleModel.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          date: { $toDate: '$createdAt' },
        },
      },
      {
        $group: {
          _id: {
            hour: {
              $dateToString: {
                format: '%Y-%m-%d %H:00:00',
                date: '$date',
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.hour': 1,
        },
      },
      {
        $project: {
          date: '$_id.hour',
          value: '$count',
          _id: 0,
        },
      },
    ]);
    return {
      code: 0,
      data: result,
    };
  }

  @CatchError()
  async getJsExceptionList(params: GetExceptionListDto & ApplicationInfo) {
    const {
      page = 1,
      pageSize = 15,
      app_id,
      app_env,
      startAt,
      endAt,
      name,
    } = params || {};

    const query: FilterQuery<JsExceptionDocument> = {
      app_id,
      app_env,
    };

    if (name) {
      query.message = {
        $regex: new RegExp(name, 'i'),
      };
    }

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    const list = await this.JsExceptionModel.find(query, null, {
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort: {
        createdAt: -1,
      },
    });

    const total = await this.JsExceptionModel.count(query);
    return {
      code: 0,
      data: {
        list,
        total,
      },
    };
  }

  @CatchError()
  async getRequestExceptionList(params: GetExceptionListDto & ApplicationInfo) {
    const {
      page = 1,
      pageSize = 15,
      app_id,
      app_env,
      startAt,
      endAt,
      name,
      url,
    } = params || {};

    const query: FilterQuery<RequestExceptionDocument> = {
      app_id,
      app_env,
    };

    if (name) {
      query.statusText = {
        $regex: new RegExp(name, 'i'),
      };
    }

    if (url) {
      query.url = {
        $regex: new RegExp(url, 'i'),
      };
    }

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    const list = await this.RequestExceptionModel.find(query, null, {
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort: {
        createdAt: -1,
      },
    });

    const total = await this.RequestExceptionModel.count(query);
    return {
      code: 0,
      data: {
        list,
        total,
      },
    };
  }
  /**
   * 资源异常列表
   *
   * @param {(GetExceptionListDto & ApplicationInfo)} params
   * @return {*}
   * @memberof ExceptionService
   */
  @CatchError()
  async getResourceExceptionList(
    params: GetExceptionListDto & ApplicationInfo,
  ) {
    const {
      page = 1,
      pageSize = 15,
      app_id,
      app_env,
      startAt,
      endAt,
      name,
    } = params || {};

    const query: FilterQuery<ResourceExceptionDocument> = {
      app_id,
      app_env,
    };

    if (name) {
      query.message = {
        $regex: new RegExp(name, 'i'),
      };
    }

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    const res = await this.ResourceExceptionModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$src',
          totalCount: { $sum: 1 },
          createdAt: {
            $first: '$createdAt',
          },
          src: {
            $first: '$src',
          },
          userCount: {
            $addToSet: {
              $ifNull: ['$ip', null],
            },
          },
          id: {
            $first: '$_id',
          },
        },
      },
      {
        $project: {
          _id: '$id',
          totalCount: 1,
          createdAt: 1,
          src: 1,
          userCount: { $size: '$userCount' },
        },
      },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          count: [{ $count: 'total' }],
        },
      },
      { $unwind: '$count' },
      { $addFields: { total: '$count.total' } },
    ]);

    const { data = [], total = 0 } = res?.[0] || {};

    return {
      code: 0,
      data: {
        list: data,
        total,
      },
    };
  }

  @CatchError()
  async getJsException(params: ApplicationInfo & GetJsExceptionDto) {
    const { app_env, app_id, id } = params;

    const result = await this.JsExceptionModel.findOne({
      app_env,
      app_id,
      _id: id,
    });

    if (!result) {
      return {
        code: 1,
        message: '未查询到记录!',
      };
    }

    const { ua, _id, eid, createdAt, trace_id, message, name, stack, href } =
      result;

    const totalCountRes = await this.JsExceptionModel.aggregate([
      {
        $match: {
          name,
          message,
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: {
              $cond: {
                if: { $gt: ['$count', null] },
                then: '$count',
                else: 1,
              },
            },
          },
        },
      },
    ]);
    let totalCount = 0;
    if (totalCountRes?.length) {
      totalCount = totalCountRes[0].count;
    }

    const userCountRes = await this.JsExceptionModel.aggregate([
      {
        $match: {
          name,
          message,
        },
      },
      {
        $group: {
          _id: '$ip',
        },
      },
      {
        $count: 'count',
      },
    ]);

    let userCount = 0;

    if (userCountRes?.length) {
      userCount = userCountRes[0].count;
    }

    const uap = new UAParser(ua);

    const os = uap.getOS();
    const engine = uap.getEngine();
    const browser = uap.getBrowser();
    const device = uap.getDevice();

    const stacks = stack.split(/\n|\\n/g);

    try {
      for (let i = 0; i < stacks.length; i++) {
        const [_, url, file, line, column] =
          stacks[i].match(/(https?:\/\/.+?)([^/]+\.js):(\d+):(\d+)/) || [];

        if (file && line && column) {
          const sourceMapConsumer = new SourcemapParser({ app_id });

          const originStack = await sourceMapConsumer.getOriginPosition(file, {
            column: Number(column),
            line: Number(line),
          });

          const {
            column: originColumn,
            source: originSource,
            line: originLine,
          } = originStack;

          if (originColumn) {
            stacks[i] = stacks[i].replace(`:${column}`, `:${originColumn}`);
          }

          if (originLine) {
            stacks[i] = stacks[i].replace(`:${line}:`, `:${originLine}:`);
          }

          if (originSource) {
            stacks[i] = stacks[i].replace(url + file, originSource);
          }

          sourceMapConsumer.destroy();
        }
      }
    } catch (error) {}

    return {
      code: 0,
      data: {
        _id,
        eid,
        createdAt,
        trace_id,
        name,
        message,
        os,
        engine,
        browser,
        device,
        ua,
        totalCount,
        userCount,
        href,
        stacks,
      },
    };
  }

  async getConsoleList(params: ApplicationInfo & GetConsoleListDto) {
    const {
      app_env,
      app_id,
      page = 1,
      pageSize = 15,
      startAt,
      endAt,
      name,
    } = params;

    const query: FilterQuery<ConsoleDocument> = {
      app_env,
      app_id,
    };

    if (startAt || endAt) {
      query.createdAt = {};
      if (startAt) query.createdAt.$gt = startAt;
      if (endAt) query.createdAt.$lt = endAt;
    }

    if (name) {
      query.messages = {
        $regex: new RegExp(name, 'i'),
      };
    }
    const result = await this.ConsoleModel.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          count: [{ $count: 'total' }],
        },
      },
      { $unwind: '$count' },
      { $addFields: { total: '$count.total' } },
    ]);

    const { data = [], total } = result?.[0] || {};

    return {
      code: 0,
      data: {
        list: data,
        total,
      },
    };
  }
}
