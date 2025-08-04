<?php

namespace Models;

use DateTime;
use Utils\Enums\VideoViewStatus;


class VideoView {
    private string $id;
    private string $videoId;
    private ?string $userId;
    private DateTime $viewedAt;
    private VideoViewStatus $status;

    private ?string $createdBy;
    private ?string $updatedBy;

    public function __construct(
        string $id,
        string $videoId,
        ?string $userId,
        DateTime $viewedAt,
        VideoViewStatus $status ,
    ) {
        $this->id = $id;
        $this->videoId = $videoId;
        $this->userId = $userId;
        $this->viewedAt = $viewedAt;
        
    
    }

    public function getId(): string { return $this->id; }
    public function getVideoId(): string { return $this->videoId; }
    public function getUserId(): ?string { return $this->userId; }
    public function getViewedAt(): DateTime { return $this->viewedAt; }
    public function getStatus(): VideoViewStatus { return $this->status; }
   

    public function setVideoId(string $videoId): void { $this->videoId = $videoId; }
    public function setVideo(Video $video): void { $this->video = $video; }
    public function setUserId(?string $userId): void { $this->userId = $userId; }
    public function setViewedAt(DateTime $date): void { $this->viewedAt = $date; }
    public function setStatus(VideoViewStatus $status): void { $this->status = $status; }
}
