// Optional: Create this endpoint if you need slug-to-id lookup
// GET /api/organizations/by-slug/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { data } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .single();
  
  return successResponse(data);
}