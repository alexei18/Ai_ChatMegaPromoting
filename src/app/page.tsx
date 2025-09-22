import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect la limba implicită (en)
  redirect('/en');
}
