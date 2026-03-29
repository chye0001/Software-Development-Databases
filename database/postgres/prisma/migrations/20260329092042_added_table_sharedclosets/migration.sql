-- CreateTable
CREATE TABLE "shared_closets" (
    "id" BIGSERIAL NOT NULL,
    "closetId" BIGINT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "shared_closets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shared_closets_closetId_userId_key" ON "shared_closets"("closetId", "userId");

-- AddForeignKey
ALTER TABLE "shared_closets" ADD CONSTRAINT "shared_closets_closetId_fkey" FOREIGN KEY ("closetId") REFERENCES "closets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_closets" ADD CONSTRAINT "shared_closets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
