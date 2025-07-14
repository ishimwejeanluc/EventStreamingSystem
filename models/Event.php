<?php
class Event {
    private string $id;
    private string $name;
    private ?string $description;
    private ?DateTime $startDate;
    private ?DateTime $endDate;
    private string $status; // 'upcoming', 'ongoing', 'completed', 'cancelled'

    private ?string $createdBy;
    private ?string $updatedBy;

    public function __construct(
        string $id,
        string $name,
        ?string $description = null,
        ?DateTime $startDate = null,
        ?DateTime $endDate = null,
        string $status = 'upcoming',
        ?string $createdBy = null,
        ?string $updatedBy = null
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->status = $status;
        $this->createdBy = $createdBy;
        $this->updatedBy = $updatedBy;
    }

    public function getId(): string { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getDescription(): ?string { return $this->description; }
    public function getStartDate(): ?DateTime { return $this->startDate; }
    public function getEndDate(): ?DateTime { return $this->endDate; }
    public function getStatus(): string { return $this->status; }
    public function getCreatedBy(): ?string { return $this->createdBy; }
    public function getUpdatedBy(): ?string { return $this->updatedBy; }

    public function setName(string $name): void { $this->name = $name; }
    public function setDescription(?string $desc): void { $this->description = $desc; }
    public function setStartDate(?DateTime $date): void { $this->startDate = $date; }
    public function setEndDate(?DateTime $date): void { $this->endDate = $date; }
    public function setStatus(string $status): void { $this->status = $status; }
    public function setCreatedBy(?string $userId): void { $this->createdBy = $userId; }
    public function setUpdatedBy(?string $userId): void { $this->updatedBy = $userId; }
}
