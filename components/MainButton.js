import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';

export default function MainButton() {
    const router = useRouter();

    return (
        <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/')}
        >
            首页
        </Button>
    );
}
