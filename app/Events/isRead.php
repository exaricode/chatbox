<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class isRead implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $message;
    public $channelName;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($message, $channelName)
    {

        $this->message = $message;
        $this->channelName = $channelName;
    }

    public function broadcastWith() {
        return [
            'id' => $this->message['id'],
            'message' => $this->message['message'],
            'is_read' => $this->message['is_read'],
            'to_user' => $this->message['to_user_id'],
            'user_id' => $this->message['user_id']
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel($this->channelName);
    }
}
