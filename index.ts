#! /usr/bin/env node

import inquirer from "inquirer";

import chalk from "chalk";

console.log(chalk.bold.bgGreenBright("Welcome to Yashwa-IT Initiative."));

class Course {
  constructor(public name: string, public fee: number, public isPaid: boolean = false) {}
}

class Student {
  private static idCounter: number = 43210;
  public id: string;
  public balance: number;
  public courses: Course[] = [];

  constructor(public name: string) {
    this.id = this.generateStudentID();
    this.balance = 28400; // Initial balance given to student.
  }

  private generateStudentID(): string {
    return (Student.idCounter++).toString().padStart(5, '0');
  }

  public enroll(course: Course): void {
    if (course.fee > 25000) {
      console.log(chalk.red(`Tuition fee for ${course.name} exceeds $25000.`));
    }
     else {
      this.courses.push(course);
      console.log(chalk.green(`Enrolled in ${course.name} successfully!`));
    }
  }

  public viewBalance(): void {
    console.log(chalk.blue(`Your current balance is $${this.balance}.`));
  }

  public payTuition(courseName: string): void {
    const course = this.courses.find(c => c.name === courseName);
    if (course) {
      if (course.fee <= this.balance) {
        if (course.isPaid) {
          console.log(chalk.yellow(`Tuition fee for ${course.name} is already paid.`));
        } 
        else {
          this.balance -= course.fee;
          course.isPaid = true;
          console.log(chalk.green(`Paid $${course.fee} for ${course.name} successfully!`));
        }
      } 
      else {
        console.log(chalk.red(`Cannot pay $${course.fee}. Insufficient balance.`));
      }
    } 
    else {
      console.log(chalk.red(`You are not enrolled in ${courseName}.`));
    }
  }

  public showStatus(): void {
    console.log(chalk.yellow(`Name: ${this.name}`));
    console.log(chalk.yellow(`ID: ${this.id}`));
    console.log(chalk.yellow(`Courses Enrolled:`));
    this.courses.forEach(course => {
      console.log(chalk.yellow(`- ${course.name}: ${course.isPaid ? "Tuition Fees is Paid" : "Tuition Fees isn't Paid"}`));
    });
    console.log(chalk.yellow(`Balance: $${this.balance}`));
  }
}
class StudentManagementSystem {
  private students: Student[] = [];

  public async start(): Promise<void> {
    let exit = false;
    while (!exit) {
      const { action } = await inquirer.prompt({
        name: "action",
        type: "list",
        message: "Choose an option",
        choices: ['Add Student', 'Enroll in Course', 'View Balance', 'Pay Tuition Fees', 'Show Status', 'Exit']
      });

      switch (action) {
        case 'Add Student':
          await this.addStudent();
          break;
        case 'Enroll in Course':
          await this.enrollInCourse();
          break;
        case 'View Balance':
          await this.viewBalance();
          break;
        case 'Pay Tuition Fees':
          await this.payTuitionFees();
          break;
        case 'Show Status':
          await this.showStatus();
          break;
        case 'Exit':
          console.log(chalk.italic.bgBlackBright("Thanks for using Yashwa-IT Initiative."));
          exit = true;
          break;
      }
    }
  }

  private async addStudent(): Promise<void> {
    const { name } = await inquirer.prompt({
      name: 'name',
      type: 'input',
      message: 'Enter student name:'
    });

    if (!name || !isNaN(Number(name))) {
      console.log(chalk.red('Please enter a valid name.'));
    }
     else if (this.students.some(student => student.name === name)) {
      console.log(chalk.red(`Student name "${name}" is taken.Please select another name.`));
    }
     else {
      const student = new Student(name);
      this.students.push(student);
      console.log(chalk.green(`Student ${name} added with ID ${student.id}`));
    }
  }

  private async selectStudent(): Promise<Student | null> {
    if (this.students.length === 0) {
      console.log(chalk.red('No students available.'));
      return null;
    }

    const { id } = await inquirer.prompt({
      name: 'id',
      type: 'list',
      message: 'Select student:',
      choices: this.students.map(student => ({ name: student.name, value: student.id }))
    });

    return this.students.find(student => student.id === id) || null;
  }

  private async enrollInCourse(): Promise<void> {
    const student = await this.selectStudent();
    if (!student) return;

    const { course } = await inquirer.prompt({
      name: 'course',
      type: 'list',
      message: 'Select course to enroll:',
      choices: [
        { name: 'Cybersecurity ($20600)', value: new Course('Cybersecurity', 20600) },
        { name: 'Cloud Computing ($20500)', value: new Course('Cloud Computing', 22500) },
        { name: 'Web Development ($15080)', value: new Course('Web Development', 15080) },
        { name: 'Software Development ($18400)', value: new Course('Software Development', 18400) },
        { name: 'AI-Engineering ($24000)', value: new Course('AI-Engineering', 24000) }
      ]
    });

    student.enroll(course);
  }

  private async viewBalance(): Promise<void> {
    const student = await this.selectStudent();
    if (student) {
      student.viewBalance();
    }
  }

  private async payTuitionFees(): Promise<void> {
    const student = await this.selectStudent();
    if (!student) return;

    const { courseName } = await inquirer.prompt({
      name: 'courseName',
      type: 'list',
      message: 'Select course to pay tuition fees for:',
      choices: student.courses.map(course => course.name)
    });

    student.payTuition(courseName);
  }

  private async showStatus(): Promise<void> {
    const student = await this.selectStudent();
    if (student) {
      student.showStatus();
    }
  }
}

const system = new StudentManagementSystem();
system.start();