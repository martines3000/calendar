import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(_: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!
  );

  const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .gte('from', today)
    .throwOnError();

  return NextResponse.json(
    {
      appointments: data,
    },
    {
      status: 200,
      headers: {
        ...CORS_HEADERS,
      },
    }
  );
}
