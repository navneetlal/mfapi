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
  const q = request.query['q'] as string;

  if (q.length < 3) return response.status(413).send({ ...Status[413], error: { message: 'Search query must be atleast 3 character' } });
  if (perPage > 100) return response.status(413).send(Status[413]);

  let mf = Enumerable.from(mfList as IScheme[])
  mf = !!q ? mf.where(e => !!e.scheme_name?.toLowerCase().includes(q) || !!e.scheme_code?.toString().includes(q)) : mf
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
