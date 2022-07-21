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

        $admins = ['admin1', 'admin2', 'admin3', 'admin4', 'admin5'];
        $testers = ['tester1', 'tester2', 'tester3', 'tester4', 'tester5'];

        foreach ($admins as $a) {
            $id = 1;
            $count = 6;
            \App\Models\User::factory()->create([
                'name' => $a,
                'username' => $a,
                'email' => $a . '@admin.com',
                'password' => bcrypt('password'),
                'is_admin' => true,
                'is_logged_in' => false
            ]);

            foreach($testers as $t) {
                
                \App\Models\Message::create([
                    'user_id' => $id,
                    'message' => 'hello ' . $t,
                    'to_user_id' => $count
                ]);
                $count++;
                $id++;
            }

        }

        foreach ($testers as $t) {
            \App\Models\User::factory()->create([
                'name' => $t,
                'username' => $t,
                'email' => $t . '@tester.com',
                'password' => bcrypt('password'),
                'is_admin' => false,
                'is_logged_in' => false
            ]);
        }
    }
}
