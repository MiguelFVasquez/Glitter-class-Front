import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudentBoardComponent } from './components/student-board/student-board.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CourseComponent } from './components/course/course.component';

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
            { path: 'courses', component:CourseComponent}
        ]
    },
    
    // Wildcard route (should be last)
    { path: '**', redirectTo: '', pathMatch: 'full' }
];