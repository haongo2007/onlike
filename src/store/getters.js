export default {
    newTask: state => state.newTask,
    tasks: state => state.tasks.filter((task) => {return !task.completed}),
    completedTask: state => state.tasks.filter((task) => {return task.completed}),
    user: state => state.user,
    authUser: state => state.authUser,
    tweets: state => state.tweets,
    token: state => state.checkLogin,
}