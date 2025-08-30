<template>
    <main id="auth">
        <h3>Get Tracking!</h3>
        <form action="">
            <label for="username">Choose a username</label>
            <input type="text" id="username" :value="username" name="username" required />
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
            <button type="submit" @click="handleSubmit">Letsa go</button>
        </form>
    </main>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const handleSubmit = async () => {
    const { data, error } = useAsyncGql({
        operation: 'register',
        variables: { username: this.username.value, email: email.value, password: password.value },
    });
    if (error.value) {
        console.error('Registration error:', error.value);
    } else {
        console.log('Registration successful:', data.value);
        // Handle successful registration (e.g., redirect to login or dashboard)
    }
}
</script>