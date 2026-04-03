<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function index()
    {
        $rewards = Reward::with('user')->latest()->get();
        return response()->json($rewards);
    }

    public function getUserRewards()
    {
        $rewards = Reward::where('user_id', auth()->id())->get();
        return response()->json($rewards);
    }
}