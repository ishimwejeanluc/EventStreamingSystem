<?php

namespace Utils\Enums;

enum UserStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';

    public static function getDefault(): self
    {
        return self::ACTIVE;
    }

    public static function isValid(string $status): bool
    {
        return in_array($status, array_column(self::cases(), 'value'));
    }
}
