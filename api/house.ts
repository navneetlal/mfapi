import { VercelRequest, VercelResponse } from '@vercel/node';
import Enumerable from 'linq';
import allowCors from '../services/allowCors';

import Status from '../data/response.json';
import mfList from '../data/mflist.json';

const handler = (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== 'GET') return response.status(405).send(Status[405]);

  const perPage = parseInt(request.query['perPage'] as string) || 20;
  const page = parseInt(request.query['page'] as string) || 1;

  if (perPage > 100) return response.status(413).send(Status[413]);

  let mf = Enumerable.from(mfList as Record<string, string>[])
    .distinct(e => e.fund_house)
    .orderBy(e => e.fund_house)
    .select(e => e.fund_house)
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
