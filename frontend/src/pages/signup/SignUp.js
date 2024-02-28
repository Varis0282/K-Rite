import React, { useEffect, useState } from 'react'
import { Field } from '../../components'
import { Link } from 'react-router-dom'
import { baseUrl } from '../../config';
import axios from 'axios';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../redux/LoaderReducer';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [user, setUser] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', userName: '', role: 'user' });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  const submitHandler = async () => {
    if (user.password === '' || user.confirmPassword === '' || user.email === '' || user.firstName === '' || user.lastName === '' || user.userName === '') {
      message.error('Please fill all the fields');
      return;
    }
    if (!passwordMatch) {
      message.error('Password does not match');
      return;
    }
    if (user.password.length < 6) {
      message.error('Password should be at least 6 characters long');
      return;
    }
    if (user.userName.length < 3) {
      message.error('Username should be at least 3 characters long');
      return;
    }
    const newUser = { ...user, name: `${user.firstName} ${user.lastName}` };
    delete newUser.confirmPassword;
    delete newUser.firstName;
    delete newUser.lastName;
    dispatch(setLoading(true))
    try {
      debugger
      const response = await axios.post(`${baseUrl}/api/user/register`, newUser);
      debugger
      if (response.data.success) {
        setUser({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
        message.success('Registered successfully');
        navigate('/login');
      }
    } catch (error) {
      debugger
      console.log(error);
      message.error(error?.response?.data?.message || 'Some error occured');
    }
    dispatch(setLoading(false))
  }

  useEffect(() => {
    if (user.password !== user.confirmPassword) {
      setPasswordMatch(false);
    }
    if (user.password === user.confirmPassword) {
      setPasswordMatch(true);
    }
    if (user.password === '' || user.confirmPassword === '') {
      setPasswordMatch(true);
    }
  }, [user.confirmPassword, user.password]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      return navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white lg:px-0 md:px-0 px-4">
      <div className="flex flex-col justify-center items-center border-[1px] border-gray-400 lg:w-[22%] md:w-1/2 w-full gap-2 shadow bg-white p-6 rounded-md">
        <h1 className="text-4xl font-bold p-2">Signup</h1>
        <div className="flex lg:flex-row md:flex-row lg:gap-0 md:gap-0 gap-2 flex-col w-full lg:ustify-between md:justify-between">
          <div className="md:w-[48%]">
            <Field
              name={'firstName'}
              label={'First Name'}
              type='text'
              placeHolder='John'
              value={user.firstName}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="md:w-[48%]">
            <Field
              name={'lastName'}
              label={'Last Name'}
              type='text'
              placeHolder='Doe'
              value={user.lastName}
              onChange={inputChangeHandler}
            />
          </div>
        </div>
        <Field
          name={'userName'}
          label={'Username'}
          placeHolder='johndoe123'
          value={user.userName}
          onChange={inputChangeHandler}
        />
        <Field
          name={'email'}
          label={'Email Id'}
          placeHolder='example@mail.com'
          value={user.email}
          onChange={inputChangeHandler}
        />
        <Field
          name={'password'}
          label={'Password'}
          type='password'
          placeHolder='*********'
          value={user.password}
          onChange={inputChangeHandler}
        />
        <Field
          name={'confirmPassword'}
          label={'Confirm Password'}
          type='password'
          placeHolder='*********'
          value={user.confirmPassword}
          onChange={inputChangeHandler}
        />
        {!passwordMatch &&
          <p className='text-red-500 text-[10px] flex items-center gap-2 justify-end w-full font-medium'>
            <i className="fa-solid fa-circle-info"></i>
            Password does not match
          </p>}
        <button className="bg-orange-500 w-full text-white p-2 rounded focus:border-none focus:outline-none focus:ring-0"
          onClick={() => submitHandler()}
          disabled={!passwordMatch}
        >
          Sign up
        </button>
        <p className='font-medium'>Already registered with us ? Continue by <Link to={'/login'} className='text-orange-500 font-semibold'>Loging in</Link></p>
      </div>
    </div>
  )
}

export default SignUp
