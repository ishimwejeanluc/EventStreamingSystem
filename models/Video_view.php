<?php
class VideoView {
    private string $id;
    private string $videoId;
    private ?string $userId;
    private DateTime $viewedAt;
    private string $status; // 'valid' or 'invalid'

    private ?string $createdBy;
    private ?string $updatedBy;

    public function __construct(
        string $id,
        string $videoId,
        ?string $userId,
        DateTime $viewedAt,
        string $status = 'valid',
        ?string $createdBy = null,
        ?string $updatedBy = null
    ) {
        $this->id = $id;
        $this->videoId = $videoId;
        $this->userId = $userId;
        $this->viewedAt = $viewedAt;
        $this->status = $status;
        $this->createdBy = $createdBy;
        $this->updatedBy = $updatedBy;
    }

    public function getId(): string { return $this->id; }
    public function getVideoId(): string { return $this->videoId; }
    public function getUserId(): ?string { return $this->userId; }
    public function getViewedAt(): DateTime { return $this->viewedAt; }
    public function getStatus(): string { return $this->status; }
    public function getCreatedBy(): ?string { return $this->createdBy; }
    public function getUpdatedBy(): ?string { return $this->updatedBy; }

    public function setVideoId(string $videoId): void { $this->videoId = $videoId; }
    public function setUserId(?string $userId): void { $this->userId = $userId; }
    public function setViewedAt(DateTime $date): void { $this->viewedAt = $date; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function setCreatedBy(?string $userId): void { $this->createdBy = $userId; }
    public function setUpdatedBy(?string $userId): void { $this->updatedBy = $userId; }
}
