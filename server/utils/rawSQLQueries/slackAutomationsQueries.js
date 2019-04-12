export const totalSlackAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId"
        from "slackAutomation"
        group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"
    where a."createdAt" BETWEEN ? and ?
;
`;

export const successSlackAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId",

        SUM(
            (
                CASE 
                    WHEN status='success' THEN 0
                    ELSE 1
                END
            )
        ) as status

        from "slackAutomation"
        group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"
    WHERE 1=1
    and s.status = 0
    and a."createdAt" BETWEEN ? and ?
;
`;
