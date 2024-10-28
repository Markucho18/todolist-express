USE todolist_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  email VARCHAR(150) NOT NULL,
  user_password VARCHAR(30) NOT NULL,
  profile_pic TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  task_id INT AUTO_INCREMENT,
  user_id INT NOT NULL, 
  task_completed BOOLEAN NOT NULL DEFAULT false,
  task_title VARCHAR(50) NOT NULL,
  task_deadline DATE,
  task_priority INT NOT NULL,
  task_description VARCHAR(150),
  PRIMARY KEY(task_id)
);

ALTER TABLE tasks
ADD CONSTRAINT fk_user_task 
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS sub_tasks (
	sub_task_id INT AUTO_INCREMENT,
    child_task_id INT NOT NULL,
    parent_task_id INT NOT NULL,
    PRIMARY KEY(sub_task_id),
    FOREIGN KEY(child_task_id) REFERENCES tasks(task_id),
    FOREIGN KEY(parent_task_id) REFERENCES tasks(task_id)
);

SELECT * FROM users;
SELECT * FROM tasks;
SELECT * FROM sub_tasks
