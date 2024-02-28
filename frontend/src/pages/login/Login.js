import React, { useEffect, useState } from 'react'
import { Field } from '../../components';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/LoaderReducer';
import { baseUrl } from '../../config';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/UserReducer';

const Login = () => {
  const [user, setUserInLocal] = useState({ key: '', password: '' });
  const dispatch = useDispatch();
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUserInLocal({ ...user, [name]: value });
  }
  const navigate = useNavigate();
  const submitHandler = async () => {
    const { key, password } = user;
    if (key === '' || password === '') {
      message.error('Please fill all the fields');
      return;
    }
    dispatch(setLoading(true))
    try {
      const data = await axios.post(`${baseUrl}/api/user/login`, user);
      if (data.data.success) {
        setUserInLocal({ key: '', password: '' });
        message.success('Logged in successfully');
        // save the token and user in the local storage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        dispatch(setUser(data.data.user));
        dispatch(setLoading(false))
        return navigate('/');
      }
    } catch (error) {
      debugger
      console.log(error);
      message.error(error.response.data.message || 'Some error occured');
    }
    dispatch(setLoading(false))
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      return navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white lg:px-0 md:px-0 px-4">
      <div className="flex flex-col justify-center items-center border-[1px] border-gray-400 lg:w-[22%] md:w-1/2 w-full gap-2 shadow bg-white p-6 rounded-md">
        <h1 className="text-4xl font-bold p-2">Login</h1>
        <Field
          name={'key'}
          label={'Email Id or Username'}
          placeHolder='Email or Username'
          value={user.key}
          onKeyUp={(e) => e.key === 'Enter' && submitHandler()}
          onChange={inputChangeHandler} />
        <Field
          name={'password'}
          label={'Password'}
          type='password'
          placeHolder='Password'
          value={user.password}
          onChange={inputChangeHandler}
          onKeyUp={(e) => e.key === 'Enter' && submitHandler()}
        />
        <div className="flex w-full justify-end">
          <Link to={'/'} className='text-orange-500 font-semibold'>Forgot your password ?</Link>
        </div>
        <button className="bg-orange-500 w-full text-white p-2 rounded focus:border-none focus:outline-none focus:ring-0"
          onClick={() => submitHandler()}
        >
          Login
        </button>
        <p className='font-medium'>Not registered yet ? Start by <Link to={'/signup'} className='text-orange-500 font-semibold'>signing up</Link></p>
      </div>
    </div>
  )
}

export default Login
