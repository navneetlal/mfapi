import { VercelRequest, VercelResponse } from '@vercel/node';
import Enumerable from 'linq';
import allowCors from '../services/allowCors';
import type IScheme from '../interfaces/scheme';

import Status from '../data/response.json';
import mfList from '../data/mflist.json';

const handler = (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'GET') return response.status(405).send(Status[405]);

  const perPage = parseInt(request.query['perPage'] as string) || 10;
  const page = parseInt(request.query['page'] as string) || 1;
  const house = request.query['fund_house'] ?? null;

  if (perPage > 100) return response.status(413).send(Status[413]);

  let mf = Enumerable.from(mfList as IScheme[])
  mf = !!house ? mf.where(e => e.fund_house === house) : mf
  const responseObj = {
    page,
    perPage,
    // @ts-ignore
    total: mf.count(),
    result: mf.skip((page - 1) * perPage)
      .take(perPage)
      .toArray()
  }
  return response.status(200).send(responseObj)
};

export default allowCors(handler);
