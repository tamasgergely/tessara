<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @mixin IdeHelperClient
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $archived_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Timer> $timers
 * @property-read int|null $timers_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ClientFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client filterListing(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client forListing($includeArchived = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client forPicking($includeArchived = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereArchivedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Client withoutTrashed()
 */
	class Client extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $fileable_type
 * @property int $fileable_id
 * @property int $user_id
 * @property string $filename
 * @property string $stored_filename
 * @property string $path
 * @property string $mime_type
 * @property int $size
 * @property string|null $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $fileable
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereFileableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereFileableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereStoredFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|File whereUserId($value)
 */
	class File extends \Eloquent {}
}

namespace App\Models{
/**
 * @mixin IdeHelperProject
 * @property int $id
 * @property int $user_id
 * @property int|null $client_id
 * @property string $name
 * @property string|null $description
 * @property string|null $archived_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Client|null $client
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\File> $files
 * @property-read int|null $files_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Timer> $timers
 * @property-read int|null $timers_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ProjectFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project filterListing(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project forListing($includeArchived = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project forPicking($includeArchived = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereArchivedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project withoutTrashed()
 */
	class Project extends \Eloquent {}
}

namespace App\Models{
/**
 * @mixin IdeHelperTask
 * @property int $id
 * @property int $user_id
 * @property int|null $project_id
 * @property int|null $client_id
 * @property string $name
 * @property string|null $description
 * @property string|null $archived_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client|null $client
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\File> $files
 * @property-read int|null $files_count
 * @property-read \App\Models\Project|null $project
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Timer> $timers
 * @property-read int|null $timers_count
 * @method static \Database\Factories\TaskFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task filterListing(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task forListing($includeArchived = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereArchivedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task withoutTrashed()
 */
	class Task extends \Eloquent {}
}

namespace App\Models{
/**
 * @property Carbon $start
 * @property Carbon|null $stop
 * @property int $id
 * @property int $timer_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Timer $timer
 * @method static \Database\Factories\TimeIntervalFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval whereStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval whereStop($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval whereTimerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TimeInterval whereUpdatedAt($value)
 */
	class TimeInterval extends \Eloquent {}
}

namespace App\Models{
/**
 * @mixin IdeHelperTimer
 * @property int $id
 * @property int $user_id
 * @property int $task_id
 * @property string|null $description
 * @property string|null $archived_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client|null $client
 * @property-read \App\Models\Project|null $project
 * @property-read \App\Models\Task $task
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TimeInterval> $timeIntervals
 * @property-read int|null $time_intervals_count
 * @method static \Database\Factories\TimerFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer filterListing(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer forListing(string $column = 'created_at', string $direction = 'desc')
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer whereArchivedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer whereTaskId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Timer whereUserId($value)
 */
	class Timer extends \Eloquent {}
}

namespace App\Models{
/**
 * @mixin IdeHelperUser
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property array<array-key, mixed>|null $preferences
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Timer> $timers
 * @property-read int|null $timers_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePreferences($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

