import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { prisma } from "@holiday-jug/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "summary";

  try {
    if (type === "summary") {
      const countryResult: any = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM "country_master"`
      );
      const cityResult: any = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM "city_master"`
      );
      const hotelResult: any = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM "hotel_master"`
      );

      return NextResponse.json({
        countriesCount: countryResult[0]?.count || 0,
        citiesCount: cityResult[0]?.count || 0,
        hotelsCount: hotelResult[0]?.count || 0,
      });
    }

    if (type === "countries") {
      const q = searchParams.get("q")?.trim() || "";
      let sql: string;

      if (q) {
        const escapedQ = q.replace(/'/g, "''");
        sql = `
          SELECT 
            c."code2",
            c."code3",
            c."name",
            COUNT(DISTINCT ci."code")::int as "cityCount",
            COUNT(h."code")::int as "hotelCount"
          FROM "country_master" c
          LEFT JOIN "city_master" ci ON ci."countryCode" = c."code2"
          LEFT JOIN "hotel_master" h ON h."countryCode" = c."code2"
          WHERE c."name" ILIKE '%${escapedQ}%' 
             OR c."code2" ILIKE '%${escapedQ}%' 
             OR c."code3" ILIKE '%${escapedQ}%'
          GROUP BY c."code2", c."code3", c."name"
          ORDER BY c."name" ASC
        `;
      } else {
        sql = `
          SELECT 
            c."code2",
            c."code3",
            c."name",
            COUNT(DISTINCT ci."code")::int as "cityCount",
            COUNT(h."code")::int as "hotelCount"
          FROM "country_master" c
          LEFT JOIN "city_master" ci ON ci."countryCode" = c."code2"
          LEFT JOIN "hotel_master" h ON h."countryCode" = c."code2"
          GROUP BY c."code2", c."code3", c."name"
          ORDER BY c."name" ASC
        `;
      }

      const countries = await prisma.$queryRawUnsafe(sql);
      return NextResponse.json({ countries });
    }

    if (type === "cities") {
      const q = searchParams.get("q")?.trim() || "";
      const country = searchParams.get("country")?.trim().toUpperCase() || "";
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "50", 10)));
      const offset = (page - 1) * limit;

      const whereClauses: string[] = [];
      if (country) {
        whereClauses.push(`ci."countryCode" = '${country.replace(/'/g, "''")}'`);
      }
      if (q) {
        const escapedQ = q.replace(/'/g, "''");
        whereClauses.push(`(ci."name" ILIKE '%${escapedQ}%' OR ci."code" ILIKE '%${escapedQ}%')`);
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

      const countSql = `SELECT COUNT(*)::int as total FROM "city_master" ci ${whereSql}`;
      const countResult: any = await prisma.$queryRawUnsafe(countSql);
      const total = countResult[0]?.total || 0;

      const dataSql = `
        SELECT 
          ci."code",
          ci."name",
          ci."countryCode",
          co."name" as "countryName"
        FROM "city_master" ci
        JOIN "country_master" co ON co."code2" = ci."countryCode"
        ${whereSql}
        ORDER BY ci."name" ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const cities = await prisma.$queryRawUnsafe(dataSql);

      return NextResponse.json({
        cities,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    if (type === "hotels") {
      const q = searchParams.get("q")?.trim() || "";
      const country = searchParams.get("country")?.trim().toUpperCase() || "";
      const city = searchParams.get("city")?.trim() || "";
      const star = searchParams.get("star")?.trim() || "";
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "50", 10)));
      const offset = (page - 1) * limit;

      const whereClauses: string[] = [];
      if (country) {
        whereClauses.push(`h."countryCode" = '${country.replace(/'/g, "''")}'`);
      }
      if (city) {
        whereClauses.push(`h."cityCode" = '${city.replace(/'/g, "''")}'`);
      }
      if (star) {
        whereClauses.push(`h."starCategory" = '${star.replace(/'/g, "''")}'`);
      }
      if (q) {
        const escapedQ = q.replace(/'/g, "''");
        whereClauses.push(`(h."name" ILIKE '%${escapedQ}%' OR h."code" ILIKE '%${escapedQ}%')`);
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

      const countSql = `SELECT COUNT(*)::int as total FROM "hotel_master" h ${whereSql}`;
      const countResult: any = await prisma.$queryRawUnsafe(countSql);
      const total = countResult[0]?.total || 0;

      const dataSql = `
        SELECT 
          h."code",
          h."name",
          h."cityCode",
          ci."name" as "cityName",
          h."countryCode",
          co."name" as "countryName",
          h."starCategory",
          h."address",
          h."postalCode",
          h."latitude",
          h."longitude",
          h."accommodationTypeSubName",
          h."chainName"
        FROM "hotel_master" h
        JOIN "city_master" ci ON ci."code" = h."cityCode"
        JOIN "country_master" co ON co."code2" = h."countryCode"
        ${whereSql}
        ORDER BY h."name" ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const hotels = await prisma.$queryRawUnsafe(dataSql);

      return NextResponse.json({
        hotels,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Master data API error:", error);
    return NextResponse.json(
      { error: "Failed to query master data", details: error.message },
      { status: 500 }
    );
  }
}
