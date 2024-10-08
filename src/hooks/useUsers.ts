import { useEffect, useState } from "react";
import userService, { User } from "../services/user-service";
import { CanceledError } from "../services/api-client";

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    // promise是异步操作；

    // .then((res) => console.log(res.data[0].name))
    const { request, cancel } = userService.getAll<User>();
    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // CanceledError是axios的
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    // 因为promise是异步请求，会在setLoading(false)之后执行，直接在catch之后写setLoading(false)是会直接跳过请求数据先执行setLoading(false)，所以不能这样写;，有两种办法解决，一种是重复写在res/err操作的回调里执行，一种是直接使用finally(setLoading(false))一步到位，但是finally()这种方式在strict模式似乎不起效，所以最终选择前者的方法；
    // setLoading(false);
    // .finally(() => setLoading(false));
    // 移除请求
    return () => cancel();
    // // ----------------------------------------------
    // // get -> await promise -> res / err

    // // effect钩子里不能传递异步函数，不能直接在efftct传递的函数的括号前面加async，所以要把获取数据的异步操作asayc挪到内部，
    // //  useEffect(async () => {});这种不允许，所以这函数内部单独用个命名为fetchUsers的函数接受整个异步操作。
    // const fetchUsers = async () => {
    //   // 考虑到promise返回的有reslove也有可能是reject，使用try catch语法，分别操作不同的结果。try获取res，如果失败，在catch里获取err；
    //   try {
    //     const res = await axios.get(
    //       "https://jsonplaceholder.typicode.com/users"
    //     );
    //     setUsers(res.data);
    //   } catch (err) {
    //     // catch语句中不能进行类型注解，所以err:AxiosError不能直接写在catch后面的括号里，写在下面的err里注解，注意要引入axios的AxiosError;
    //     setError((err as AxiosError).message);
    //   }
    // };
    // fetchUsers();
    // // ------------------------------------------------------
  }, []);
  return { users, error, isLoading, setUsers, setError, setLoading };
};

export default useUsers;
