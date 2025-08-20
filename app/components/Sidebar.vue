<template>
    <aside>
        <nav>
            <ul>
                <li><a href="#home">Tracker</a></li>
                <li><a href="#about">Habbits</a></li>
                <li><a href="#services">Friends</a></li>
                <li><a href="#contact">Insights</a></li>
            </ul>
        </nav>
    </aside>
</template>

<style>
    aside {
        width: 250px;
        background-color: var(--night);
        color: var(--white);
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    }

    nav ul {
        list-style-type: none;
        padding: 0;
    }

    nav ul li {
        margin: 15px 0;
    }

    nav ul li a {
        color: var(--citrus);
        text-decoration: none;
    }

    nav ul li a:hover {
        text-decoration: underline;
    }
</style>