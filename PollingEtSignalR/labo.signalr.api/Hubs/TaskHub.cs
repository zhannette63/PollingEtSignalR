using labo.signalr.api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace labo.signalr.api.Hubs
{
    public class TaskHub : Hub

    {
        public static class UserHandler
        {
            public static HashSet<string> ConnectedIds = new HashSet<string>();
        }
        ApplicationDbContext _context;

        public TaskHub(ApplicationDbContext context)
        {
            _context = context;
        }
        public override async Task OnConnectedAsync()
        {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            //Compter combien d'utilisateurs connecter 
            await Clients.All.SendAsync("UserCount", UserHandler.ConnectedIds.Count);
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList());
        }
        public async Task AddTask(string task)
        {
            _context.UselessTasks.Add(new Models.UselessTask() { Text = task });
            _context.SaveChanges();
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList());
        }
        public  async Task CompleteTask(int taskid)
        {
            var task = _context.UselessTasks.Single(t => t.Id == taskid);
            task.Completed = true;
            _context.SaveChanges();
            await Clients.All.SendAsync("TaskList", _context.UselessTasks.ToList());

        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("UserCount", UserHandler.ConnectedIds.Count);
            await base.OnDisconnectedAsync(exception);

        }
    }
}
