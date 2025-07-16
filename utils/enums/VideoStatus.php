<?php

enum VideoStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public static function getDefault(): self
    {
        return self::DRAFT;
    }

    public static function isValid(string $status): bool
    {
        return in_array($status, array_column(self::cases(), 'value'));
    }
}
