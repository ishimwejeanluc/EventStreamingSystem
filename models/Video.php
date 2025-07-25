<?php

namespace Models;

use Utils\Enums\VideoStatus;

class Video {
    private string $id;
    private string $title;
    private ?string $description;
    private string $filePath;
    private ?string $thumbnailPath;
    private ?int $duration;
    private ?string $eventId;
    private string $uploadedBy;
    private VideoStatus $status;

    private ?string $createdBy;
    private ?string $updatedBy;

    public function __construct(
        string $id,
        string $title,
        string $filePath,
        
        ?string $description = null,
        ?string $thumbnailPath = null,
        ?int $duration = null,
        ?string $eventId = null,
        ?string $createdBy = null,
        ?string $updatedBy = null
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->filePath = $filePath;
        $this->thumbnailPath = $thumbnailPath;
        $this->duration = $duration;
        $this->eventId = $eventId;
        $this->createdBy = $createdBy;
        $this->updatedBy = $updatedBy;
    }

    public function getId(): string { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function getDescription(): ?string { return $this->description; }
    public function getFilePath(): string { return $this->filePath; }
    public function getThumbnailPath(): ?string { return $this->thumbnailPath; }
    public function getDuration(): ?int { return $this->duration; }
    public function getEventId(): ?string { return $this->eventId; }
    public function getStatus(): VideoStatus { return $this->status; }
    public function getCreatedBy(): ?string { return $this->createdBy; }
    public function getUpdatedBy(): ?string { return $this->updatedBy; }

    public function setTitle(string $title): void { $this->title = $title; }
    public function setDescription(?string $desc): void { $this->description = $desc; }
    public function setFilePath(string $path): void { $this->filePath = $path; }
    public function setThumbnailPath(?string $path): void { $this->thumbnailPath = $path; }
    public function setDuration(?int $duration): void { $this->duration = $duration; }
    public function setEventId(?string $id): void { $this->eventId = $id; }
    public function setStatus(VideoStatus $status): void { $this->status = $status; }
    public function setCreatedBy(?string $userId): void { $this->createdBy = $userId; }
    public function setUpdatedBy(?string $userId): void { $this->updatedBy = $userId; }
}
