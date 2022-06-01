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
             'email' => 'admin@admin.com',
             'password' => bcrypt('password')
         ]);

         \App\Models\User::factory()->create([
            'name' => 'tester1',
            'email' => 'tester1@test.com',
            'password' => bcrypt('password')
         ]);

         \App\Models\User::factory()->create([
            'name' => 'tester2',
            'email' => 'tester2@test.com',
            'password' => bcrypt('password')
         ]);

         \App\Models\Message::create([
             'id' => 1,
             'user_id' => 1,
             'message' => 'test hello'
         ]);
    }
}
