import React from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type {LoginForm} from '@/types';

const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

interface Props {
    onSubmit: (data: LoginForm) => void;
}

const LoginForm: React.FC<Props> = ({onSubmit}) => {
    const {register, handleSubmit, formState: {errors}} = useForm<LoginForm>({
        resolver: yupResolver(schema),
    });

    const inputStyle = {
        color: '#000', // Black text
        backgroundColor: '#fff', // White background
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" {...register('username')} style={inputStyle} />
                {errors.username && <p>{errors.username.message}</p>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" {...register('password')} style={inputStyle} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;