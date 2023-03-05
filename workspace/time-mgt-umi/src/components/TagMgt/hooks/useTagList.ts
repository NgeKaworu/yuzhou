
import { page } from '../services';
import { useQuery } from '@tanstack/react-query';


export default (...args: Parameters<typeof page>) => {
    return useQuery<any>('tag-list', () => page(...args))
}