import React from 'react';
import './App.css';

import TasksBoard from "./components/tasksBoard/TasksBoard";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="App">
        <Header />

        <main className='main-content'>
            <TasksBoard/>
        </main>

        <Footer />
    </div>
  );
}

export default App;
