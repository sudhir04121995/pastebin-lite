
import CreatePasteForm from '@/components/CreatePasteForm';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  return (
    <>
      <CreatePasteForm />
      <Toaster position="top-right" />
    </>
  );
}
