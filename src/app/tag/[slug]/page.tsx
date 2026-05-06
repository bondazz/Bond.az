import { redirect } from 'next/navigation';

export default async function RootTagPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Redirect to default language (AZ) for tag pages accessed without language prefix
    redirect(`/az/tag/${slug}`);
}
