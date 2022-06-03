<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
             'name' => 'admin',
             'username' => 'admin',
             'email' => 'admin@admin.com',
             'password' => bcrypt('password'),
             'is_admin' => true,
             'is_logged_in' => false,
         ]);

         \App\Models\User::factory()->create([
            'name' => 'tester1',
            'username' => 'tester123',
            'email' => 'tester1@test.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
            'is_logged_in' => false
         ]);

         \App\Models\User::factory()->create([
            'name' => 'tester2',
            'username' => '2tester',
            'email' => 'tester2@test.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
            'is_logged_in' => false
         ]);

         \App\Models\Message::create([
             'user_id' => 1,
             'message' => 'test hello'
         ]);
    }
}
