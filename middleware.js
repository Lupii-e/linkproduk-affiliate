import { NextResponse } from 'next/server';

export function middleware(request) {
  const basicAuth = request.headers.get('authorization');

  // Ambil kredensial rahasia dari environment variables
  const USER = process.env.ADMIN_USERNAME;
  const PASS = process.env.ADMIN_PASSWORD;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // Decode dari base64: 'user:pass'
    const [user, pass] = Buffer.from(authValue, 'base64').toString().split(':');

    // Verifikasi
    if (user === USER && pass === PASS) {
      // Jika benar, izinkan akses
      return NextResponse.next();
    }
  }

  // Jika gagal atau tidak ada header, kirim respons 401 (Unauthorized)
  // Ini akan memicu dialog login di browser
  return new NextResponse('Autentikasi Dibutuhkan', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Akses Admin"',
    },
  });
}

// Terapkan middleware hanya ke path /admin dan semua sub-path-nya
export const config = {
  matcher: ['/admin/:path*'],
};