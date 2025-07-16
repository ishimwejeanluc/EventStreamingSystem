<?php

enum UserRole: string
{
    case ADMIN = 'admin';
    case VIEWER = 'viewer';

    public static function getDefault(): self
    {
        return self::VIEWER;
    }

    public static function isValid(string $role): bool
    {
        return in_array($role, array_column(self::cases(), 'value'));
    }
}
