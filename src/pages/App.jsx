import { useEffect, useState } from 'react';
import '../static/css/App.css';
import axios from 'axios';
import { HeaderApp } from '../components/HeaderApp';

export function App() {
    const [tableros, setTableros] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [updateTablero, setUpdateTablero] = useState(null);
    const [updateTarea, setUpdateTarea] = useState(null);
    const [showMenu, setShowMenu] = useState(null);
    const [deleteTablero, setDeleteTablero] = useState(null);
    const [deleteTarea, setDeleteTarea] = useState(null);
    const [findByTablero, setFindByTablero] = useState(null);
    const [tareaSelected, setTareaSelected] = useState(null);

    const [groupForm, setGroupForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [tareaForm, setTareaForm] = useState(false);
    const [updateTask, setUpdateTask] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [deleteTask, setDeleteTask] = useState(false);
    const [elementos, setElementos] = useState(false);
    const [tablas, setTablas] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    
    const currentUserId = localStorage.getItem("id_usuario");

    const btnPlus = () => setGroupForm(true);
    const btnAdd = () => setTareaForm(true);

    const btnCancel = () => {
        setGroupForm(false);
        setUpdateForm(false);
        setDeleteAlert(false);
        setDeleteTask(false);
        setTareaForm(false);
    };

    const btnMenu = (id) => setShowMenu(prevId => (prevId === id ? null : id));

    const btnEditar = (tablero) => {
        setUpdateTablero(tablero);
        setUpdateForm(true);
    };

    const btnEliminar = (tablero) => {
        setDeleteTablero(tablero);
        setDeleteAlert(true);
    };

    const tableroSelected = (tablero) => {
        setFindByTablero(tablero);
        fetchTareasPorTablero(tablero.idGrupo);
    };

    const view = (tarea) => setTareaSelected(tareaSelected?.idTarea === tarea.idTarea ? null : tarea);

    const btnBorrar = (tarea) => {
        setDeleteTarea(tarea);
        setDeleteTask(true);
    };

    const btnActualizar = (tarea) => {
        setUpdateTarea(tarea);
        setUpdateTask(true);
    };

    useEffect(() => {
        fetchTableros();
        const handleClickOutside = (event) => {
            if (!event.target.closest('.menu-container') && !event.target.closest('.menu')) {
                setShowMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchTableros = async () => {
        try {
            const response = await axios.get('http://localhost:8000/grupos');
            setTableros(response.data);
            setTablas(response.data.length > 0);
        } catch (error) {
            console.error("Error al obtener los tableros", error);
        }
    };

    const fetchTareasPorTablero = async (idGrupo) => {
        try {
            const response = await axios.get(`http://localhost:8000/grupos/${idGrupo}/tareas`);
            setTareas(response.data);
            setElementos(response.data.length > 0);
        } catch (error) {
            console.error("Error al obtener las tareas por tablero", error);
        }
    };

    const btnCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const grupo = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            usuario: currentUserId
        };
        try {
            await axios.post('http://localhost:8000/grupos', grupo);
            fetchTableros();
            setGroupForm(false);
        } catch (error) {
            console.error('Error al crear un nuevo tablero', error);
        }
    };

    const btnNewTarea = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const tarea = {
            titulo: formData.get('titulo'),
            descripcion: formData.get('descripcion'),
            fecha_final: formData.get('fecha_final'),
            prioridad: formData.get('prioridad'),
            idGrupo: findByTablero.idGrupo
        };
        try {
            await axios.post('http://localhost:8000/tareas', tarea);
            fetchTareasPorTablero(findByTablero.idGrupo);
            setTareaForm(false);
        } catch (error) {
            console.error('Error al crear una nueva tarea', error);
        }
    };

    const btnUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const changes = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion')
        };
        try {
            await axios.put(`http://localhost:8000/grupos/${updateTablero.idGrupo}`, changes);
            fetchTableros();
            setUpdateForm(false);
        } catch (error) {
            console.error('Error al actualizar el tablero', error);
        }
    };

    const btnDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/grupos/${deleteTablero.idGrupo}`);
            fetchTableros();
            setDeleteAlert(false);
        } catch (error) {
            console.error('Error al eliminar el tablero', error);
        }
    };

    const btnEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const changes = {
            titulo: formData.get('titulo'),
            descripcion: formData.get('descripcion'),
            fecha_final: formData.get('fecha_final'),
            prioridad: formData.get('prioridad')
        };
        try {
            await axios.put(`http://localhost:8000/tareas/${updateTarea.idTarea}`, changes);
            fetchTareasPorTablero(findByTablero.idGrupo);
            setTareaSelected(null);
            setUpdateTask(false);
        } catch (error) {
            console.error('Error al actualizar la tarea', error);
        }
    };

    const btnRemove = async () => {
        try {
            await axios.delete(`http://localhost:8000/tareas/${deleteTarea.idTarea}`);
            fetchTareasPorTablero(findByTablero.idGrupo);
            setDeleteTask(false);
        } catch (error) {
            console.error('Error al eliminar la tarea', error);
        }
    };

    const checkFinalizar = async (tarea) => {
        const check = { ...tarea, finalizado: !tarea.finalizado };
        try {
            const response = await axios.put(`http://localhost:8000/tareas/${tarea.idTarea}/finalizado`, check);
            setTareas(tareas.map(t => t.idTarea === tarea.idTarea ? response.data : t));
        } catch (error) {
            console.error('Error al actualizar la tarea', error);
        }
    };

    const getPrioridadClass = (prioridad) => {
        switch (prioridad) {
            case 'baja': return 'prioridad-baja';
            case 'media': return 'prioridad-media';
            case 'alta': return 'prioridad-alta';
            default: return '';
        }
    };

    const enviarMensajeIA = async (e) => {
        e.preventDefault();

        if (!chatInput.trim()) return;

        const nuevoMensaje = {
            texto: chatInput,
            remitente: 'usuario',
            hora: new Date().toLocaleString()
        };

        setChatMessages(prev => [...prev, nuevoMensaje]);
        setChatInput('');

        try {
            const response = await axios.post('http://localhost:8000/chatbot/', {
                mensaje: chatInput
            });

            const respuestaBot = {
                texto: response.data.mensaje || "Tarea creada correctamente.",
                remitente: 'bot',
                hora: new Date().toLocaleString()
            };

            fetchTableros();

            setChatMessages(prev => [...prev, respuestaBot]);

        } catch (error) {
            const errorBot = {
                texto: 'Hubo un error al procesar el mensaje.',
                remitente: 'bot',
                hora: new Date().toLocaleString()
            };
            setChatMessages(prev => [...prev, errorBot]);
        }
    };
        return (
        <>
            <HeaderApp />
            <main className={(groupForm || tareaForm || updateForm || updateTask || deleteAlert || deleteTask) ? 'blur' : ''}>
                <section className="work-board section">
                    <header className='section-header'>
                        <h3><i className="bi bi-view-stacked"></i>Tableros</h3>
                        <button className='btn-add' onClick={btnPlus}>
                            <i className="bi bi-node-plus"></i>
                        </button>
                    </header>

                    {tablas ? (
                        <>
                            {tableros.map(tablero => (
                                <div key={tablero.idGrupo} className='btn-table'>
                                    <button className='task' onClick={() => tableroSelected(tablero)}>{tablero.nombre}</button>
                                    <button type='button' className='menu' onClick={() => btnMenu(tablero.idGrupo)}>
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>

                                    {showMenu === tablero.idGrupo && (
                                        <div className='menu-container'>
                                            <button className='menu-btn' onClick={() => btnEditar(tablero)}>
                                                <i className="bi bi-pencil"></i> Editar
                                            </button>
                                            <button className='menu-btn' onClick={() => btnEliminar(tablero)}>
                                                <i className="bi bi-trash3"></i> Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <h4 className='msg-placeholder-dark'>
                            Agrega un nuevo tablero <i className="bi bi-arrow-up-right-circle"></i>
                        </h4>
                    )}
                </section>

                <section className="work-list section">
                    <header className='section-header'>
                        <h3><i className="bi bi-check2-square"></i>Tareas</h3>
                        <button className='btn-add' onClick={btnAdd}>
                            <i className="bi bi-plus-square"></i>
                        </button>
                    </header>

                    <div className='container'>
                        <section className='list-board'>
                            {findByTablero ? (
                                elementos ? (
                                    <ul>
                                        {tareas.map(tarea => (
                                            <li key={tarea.idTarea}>
                                                <input type="checkbox" checked={tarea.finalizado} onChange={() => checkFinalizar(tarea)} />
                                                <p className={tarea.finalizado ? 'checked' : ''}>{tarea.titulo}</p>
                                                <button className={`view ${tareaSelected?.idTarea === tarea.idTarea ? 'active' : ''}`} onClick={() => view(tarea)}>
                                                    <i className={`bi ${tareaSelected?.idTarea === tarea.idTarea ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                </button>
                                                <button className='trash' onClick={() => btnBorrar(tarea)}>
                                                    <i className="bi bi-trash3"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <h4 className='msg-placeholder'>
                                        Agrega nuevas tareas a tu tablero <i className="bi bi-arrow-up-right-circle"></i>
                                    </h4>
                                )
                            ) : (
                                <h3 className='msg-placeholder'>
                                    <i className="bi bi-arrow-left-circle"></i> Selecciona un tablero de tareas
                                </h3>
                            )}
                        </section>

                        {tareaSelected && (
                            <section className='description-board'>
                                <div className='title'>
                                    <div className="title-contain">
                                        <i className="bi bi-body-text"></i>
                                        <h4>{tareaSelected.titulo}</h4>
                                        <button className='edit' onClick={() => btnActualizar(tareaSelected)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    </div>

                                    <div className='details'>
                                        <span className={getPrioridadClass(tareaSelected.prioridad)}>{tareaSelected.prioridad}</span>
                                        <p>{tareaSelected.fecha_final}</p>
                                    </div>
                                </div>
                                <p>{tareaSelected.descripcion}</p>
                            </section>
                        )}
                    </div>
                </section>

                <div className="complements">
                    <section className='section'>
                        <h3>Diagrama</h3>
                    </section>

                    <div className='bot-section'>
                        <img className='bot' src="/img/asistente.jpeg" alt='Rimuru-bot' />

                        <section className='notifications section'>
                            <header>
                                <h3><i className="bi bi-chat-fill"></i>Chat Bot</h3>
                                <button><i className="bi bi-x-lg"></i></button>
                            </header>
                            <div className='body-chat'>
                                <div className='text-chat'>
                                    {chatMessages.map((msg, index) => (
                                        <div className='message' key={index}>
                                            <p className='text'>
                                                {msg.remitente === 'usuario' ? "Tú" : "IA"}: {msg.texto}
                                                <span>{msg.hora}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className='send-text'>
                                    <form onSubmit={enviarMensajeIA}>
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Escribe tu mensaje..."
                                        />
                                        <button type="submit">Enviar</button>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* -- Elementos emergentes -- */}
            {groupForm && (
                <form className='form-board' onSubmit={btnCreate}>
                    <header>
                        <h4>Tablero Nuevo</h4>
                        <button onClick={btnCancel}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </header>
                    <input type="text" name='nombre' placeholder='Nombre del tablero' required />
                    <textarea name="descripcion" id="descripcion" rows={8} placeholder='Descripción'></textarea>
                    <button className='btn-submit' type='submit'>Crear</button>
                </form>
            )}

            {updateForm && (
                <form className='form-board' onSubmit={btnUpdate}>
                    <header>
                        <h4>Editar el tablero</h4>
                        <button onClick={btnCancel}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </header>
                    <input type="text" name='nombre' defaultValue={updateTablero.nombre} />
                    <textarea name="descripcion" id="descripcion" rows={8} defaultValue={updateTablero.descripcion}></textarea>
                    <button className='btn-submit' type='submit'>Guardar</button>
                </form>
            )}

            {deleteAlert && (
                <div className="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <button className='closed' onClick={btnCancel}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                    <p>¿Seguro que deseas eliminar el tablero <span>{deleteTablero.nombre}</span>?</p>
                    <button className='btn-delete' onClick={btnDelete}>Eliminar</button>
                </div>
            )}

            {tareaForm && (
                <form className='form-task' onSubmit={btnNewTarea}>
                    <header>
                        <h4>Tarea Nueva</h4>
                        <button onClick={btnCancel}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </header>
                    <input type="text" name='titulo' placeholder='Titulo de la tarea' required />
                    <textarea name="descripcion" id="descripcion" rows={8} placeholder='Descripción' required></textarea>
                    <div className='data'>
                        <div className='info'>
                            <p>Fecha final</p>
                            <input type="date" name="fecha_final" required />
                        </div>
                        <div className='info'>
                            <p>Prioridad</p>
                            <select name="prioridad" id="prioridad" required>
                                <option value="">--</option>
                                <option value="baja">BAJA</option>
                                <option value="media">MEDIA</option>
                                <option value="alta">ALTA</option>
                            </select>
                        </div>
                    </div>
                    <button className='btn-submit' type='submit'>Agregar</button>
                </form>
            )}

            {updateTask && (
                <form className='form-task' onSubmit={btnEdit}>
                    <header>
                        <h4>Editando la tarea</h4>
                        <button onClick={btnCancel}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </header>
                    <input type="text" name='titulo' defaultValue={updateTarea.titulo} />
                    <textarea name="descripcion" id="descripcion" rows={8} defaultValue={updateTarea.descripcion}></textarea>
                    <div className='data'>
                        <div className='info'>
                            <p>Fecha final</p>
                            <input type="date" name="fecha_final" defaultValue={updateTarea.fecha_final} />
                        </div>
                        <div className='info'>
                            <p>Prioridad</p>
                            <select name="prioridad" id="prioridad" defaultValue={updateTarea.prioridad}>
                                <option value="">--</option>
                                <option value="baja">BAJA</option>
                                <option value="media">MEDIA</option>
                                <option value="alta">ALTA</option>
                            </select>
                        </div>
                    </div>
                    <button className='btn-submit' type='submit'>Guardar</button>
                </form>
            )}

            {deleteTask && (
                <div className="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <button className='closed' onClick={btnCancel}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                    <p>¿Seguro que deseas eliminar la tarea <span>{deleteTarea.titulo}</span>?</p>
                    <button className='btn-delete' onClick={btnRemove}>Eliminar</button>
                </div>
            )}
        </>
    );

}
