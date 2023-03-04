
import { page } from '../services';
import { useQuery } from 'react-query';


export default (...args: Parameters<typeof page>) => {
    return useQuery<any>('tag-list', () => page(...args))
}