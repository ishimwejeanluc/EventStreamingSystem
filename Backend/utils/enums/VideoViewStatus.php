<?php

namespace Utils\Enums;

enum VideoViewStatus: string
{
    case VALID = 'valid';
    case INVALID = 'invalid';

    public static function getDefault(): self
    {
        return self::VALID;
    }

    public static function isValid(string $status): bool
    {
        return in_array($status, array_column(self::cases(), 'value'));
    }
}
