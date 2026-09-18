"use client";

import React from "react";
import { useEffect } from "react";
import { UselessTask } from "../models/UselessTask";
import TaskView from "../_components/tasks-view";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export default function Home() {

  const [tasks, setTasks] = React.useState<UselessTask[]>([]);
  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [usercount, setUserCount] = React.useState<number>(0);

  useEffect(() => {
      connecttohub();
    }, []);

  function connecttohub() {
    let testTasks = new Array<UselessTask>(
          { id: 1, text: "Test Task 1", completed: false },
          { id: 2, text: "Test Task 2", completed: true });
        setTasks(testTasks);
    // TODO On doit commencer par créer la connexion vers le Hub
    let newHubConnection = new HubConnectionBuilder()
                              .withUrl('https://localhost:7289/tasks')
                              .withAutomaticReconnect()
                              .build();
    // TODO On peut commencer à écouter pour les évènements qui vont déclencher des callbacks
    newHubConnection.on('Unefonction',(data: any)=> {
        setUserCount(data);
    });
    // TODO On doit ensuite se connecter
    newHubConnection.start().then(()=> {
            console.log('La connexion est active!');
          }) 
          .catch((err: string) => console.log('Error while starting connection: ' + err))
  }

  function onTaskToggle(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur
   hubConnection?.invoke('CompleteTask',id);

    let tasksCopy : UselessTask[] = [...tasks];    
    tasksCopy.find(task => task.id === id)!.completed = true;
    setTasks(tasksCopy);
      
  }

  function handleTaskAdd(taskName: string) {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur
    hubConnection?.invoke('AddTask', taskName);
  }

  return (
    <div className="p-4">
        <h1>SignalR!</h1>
        <TaskView 
          tasks={tasks} 
          onTaskAdd={handleTaskAdd}
          onTaskToggle={onTaskToggle}
        />
        <p>Nombre d'utilisateurs connectés: {usercount}</p>
    </div>
  );
}