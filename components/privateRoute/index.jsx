import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AdminPrivateRoute({ children }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Loaidng....</div>
    }
    if (!session) {
        router.push('/');
        return null;
    }

    if (!session.user.isAdmin) {
        router.push('/');
        return null;
    }

    return children;

}