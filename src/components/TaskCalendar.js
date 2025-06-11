import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import '../static/css/Calendar.css'; // Importa los estilos de la librería

const TaskCalendar = () => {
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState(new Date());

    // Obtener tareas de la base de datos
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tareas'); // Ajusta la URL según tu API
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    // Filtrar tareas por fecha
    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            const taskDate = new Date(task.fecha_final);
            return taskDate.toLocaleDateString() === date.toLocaleDateString();
        });
    };

    return (
        <div className="task-calendar-container">
            <div className="task-calendar">
                <h3>Calendario de Tareas</h3>
                <Calendar
                    onChange={setDate}
                    value={date}
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            const tasksForDate = getTasksForDate(date);
                            return (
                                tasksForDate.length > 0 && (
                                    <div className="task-indicator">
                                        {tasksForDate.length}
                                    </div>
                                )
                            );
                        }
                        return null;
                    }}
                />
            </div>

            <div className="task-tasks">
                <h4>Tareas para {date.toLocaleDateString()}</h4>
                <ul>
                    {getTasksForDate(date).map((task) => (
                        <li key={task.idTarea}>
                            {task.titulo} - {task.prioridad} - {task.fecha_final}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskCalendar;
