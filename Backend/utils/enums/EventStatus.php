<?php

namespace Utils\Enums;

enum EventStatus: string
{
    case UPCOMING = 'upcoming';
    case ONGOING = 'ongoing';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public static function getDefault(): self
    {
        return self::UPCOMING;
    }

    public static function isValid(string $status): bool
    {
        return in_array($status, array_column(self::cases(), 'value'));
    }
}
