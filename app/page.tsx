import { useRouter } from 'next/router';

export default function SyntheticV0PageForDeployment() {
  const router = useRouter();

  router.push('/login');

  return null;
}
