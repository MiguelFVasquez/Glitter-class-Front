import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudentBoardComponent } from './components/student-board/student-board.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CourseComponent } from './components/course/course.component';
import { DetailCourseComponent } from './components/detail-course/detail-course.component';
import { ProfessorBoardComponent } from './components/professor-board/professor-board.component';
import { ProfessorProfileComponent } from './components/professor-profile/professor-profile.component';
import { QuestionBoardComponent } from './components/question-board/question-board.component';
import { ExamBoardComponent } from './components/exam-board/exam-board.component';

export const routes: Routes = [
    // Main page route
    { path: '', component: HomeComponent },

    // Student routes
    {
        path: 'student',
        component: StudentBoardComponent,
        children: [
            // Default child route with proper pathMatch
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: 'profile', component: ProfileComponent },
            { path: 'courses', component:CourseComponent},
                // Add course detail as child route under student
            { path: 'courses/:id', component: DetailCourseComponent }
        ]
    },
    // Professor routes
    {
        path: 'professor',
        component: ProfessorBoardComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: 'profile', component: ProfessorProfileComponent },
            { path: 'questions', component: QuestionBoardComponent},
            { path: 'exam', component: ExamBoardComponent}
        ]
    },

    // Wildcard route (should be last)
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
