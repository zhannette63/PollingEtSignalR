"use client";

import React, { useEffect } from "react";
import axios from "axios";
import TaskView from "../_components/tasks-view";
import { UselessTask } from "../models/UselessTask";

export default function Home() {

  const [tasks, setTasks] = React.useState<UselessTask[]>([]);

  useEffect(() => {
    updateTasks();
  }, []);

  async function handleTaskAdd(taskName: string) {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur (Contrôleur d'API)
    const resultat= await axios.post("https://localhost:7289/api/UselessTasks/Add/"+ taskName);
    console.log(resultat.data)
    setTasks(()=>[...tasks, resultat.data]);
   
  }

  async function onTaskToggle(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur (Contrôleur d'API)
   const resultat= await axios.get("https://localhost:7289/api/UselessTasks/Complete/"+ id);
    let tasksCopy : UselessTask[] = [...tasks];    
    tasksCopy.find(task => task.id === id)!.completed = true;
    setTasks(tasksCopy);
    console.log(resultat.data);
  }

  async function updateTasks() {
    let testTasks = new Array<UselessTask>(
      { id: 1, text: "Test Task 1", completed: false },
      { id: 2, text: "Test Task 2", completed: true });
    setTasks(testTasks);
    // TODO: Faire une première implémentation simple avec un appel au serveur pour obtenir la liste des tâches
    // TODO: UNE FOIS QUE VOUS AVEZ TESTER AVEC DEUX CLIENTS: Utiliser le polling pour mettre la liste de tasks à jour chaque seconde
 
    const result= await axios.get("https://localhost:7289/api/UselessTasks/GetAll")
    console.log(result.data)

       console.log("======= Je polle ======");
       setTasks(result.data);
       setTimeout(()=>{})
  }

  return (
    <div className="p-4">
        <h1>Polling!</h1>
        <TaskView 
          tasks={tasks} 
          onTaskAdd={handleTaskAdd}
          onTaskToggle={onTaskToggle}
        />
    </div>

  );
}