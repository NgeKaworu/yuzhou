import { page } from '../services';
import { useQuery } from 'react-query';


export default (...args: Parameters<typeof page>) => useQuery<any>(['tag-list', ...args], () => page(...args))