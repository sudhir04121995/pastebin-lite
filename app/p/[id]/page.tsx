
import PasteView from '@/components/PasteView';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Paste ${id} | Pastebin Lite`,
  };
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <>
      <PasteView id={id} />
      <Toaster position="top-right" />
    </>
  );
}